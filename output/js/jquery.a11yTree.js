;(function ( $, window, document, undefined ) {
    var PLUGIN_NAME = 'a11yTree';
    var PLUGIN_PREFIX = 'plugin_';
    var LIST_SELECTOR = 'ul', LIST_ITEM_SELECTOR = 'li';
    var ID_ATTR_NAME = 'id', ITEM_ID_PREFIX = 'at', ITEM_ID_DATA_ATTR = 'at-identity', NODE_LABEL_SUFFIX = '-label', NODE_ID_PREFIX = '-n';
    var TABINDEX_ATTR_NAME = 'tabindex';
    var KEYDOWN_EVENT = 'keydown', CLICK_EVENT = 'click';
    var ROLE_ATTR_NAME = 'role', ARIA_LEVEL_ATTR_NAME = 'aria-level';
    var ARIA_TREE_ROLE = 'tree', ARIA_TREEITEM_ROLE = 'treeitem', ARIA_GROUP_ROLE = 'group';
    var ARIA_SELECTED_ATTR = 'aria-selected', ARIA_HIDDEN_ATTR = 'aria-hidden', ARIA_EXPANDED_ATTR='aria-expanded', ARIA_ACTIVEDESCENDANT_ATTR='aria-activedescendant', ARIA_LABELLEDBY_ATTR = 'aria-labelledby';
    var EXPANDED_ITEM_SELECTOR = 'li[aria-expanded="true"]', ITEM_SELECTED_SELECTOR = '[aria-selected="true"]';
    var HAS_CHILDREN_CLASS = 'at-has-children', HAS_CHILDREN_CLASS_SELECTOR = '.' + HAS_CHILDREN_CLASS;
    var NO_CHILDREN_CLASS = 'at-no-children';
    var TOGGLE_CLASS = 'at-toggle', TOGGLE_CLASS_SELECTOR = '.' + TOGGLE_CLASS;
    var DOWN_ARROW_KEY = 40, UP_ARROW_KEY = 38, RIGHT_ARROW_KEY = 39, LEFT_ARROW_KEY = 37, ENTER_KEY=13, END_KEY=35, HOME_KEY=36;

    var defaults = {
        treeLabelId : undefined,
        treeItemLabelSelector : undefined,
        toggleSelector : undefined,
        insertToggle : true,
        customToggle : {
            html : undefined
        },
        onExpand : function() {},
        onCollapse : function() {},
        markEntryActiveOnScroll: true
    };

    function Plugin( element, options ) {
        this.element = element;
        this.treeIdPiece = this.element.id ? '-' + this.element.id : '';
        this.options = $.extend( {}, defaults, options);
        this.init();
    }

    Plugin.prototype = {
        init : function () {
            var $tree = $(this.element);
            this.identifyChildren($tree, ARIA_TREE_ROLE, 1);
            this.addTreeLabels($tree);
            this.attachToggle($tree);
            this.addMouseNav($tree);
            this.addKeyBoardNav($tree);
            this.highlightByUrlAndFragment($tree, location.pathname, location.hash);
            if (this.options.markEntryActiveOnScroll) {
                // Highlight #anchor menu entries when target is scrolled to
                // Depends on scrollParent() method from jQuery UI
                this.initMarkActiveOnScroll($tree, location.pathname);
            }
        },
        addIdToTreeLabels: function ($tree) {
            var self = this;
            var treeItemLabelSelector = self.options.treeItemLabelSelector;
            if (treeItemLabelSelector) {
                var $treeItems = $tree.find(HAS_CHILDREN_CLASS_SELECTOR);
                $treeItems.each(function () {
                    var $treeItem = $(this);
                    var labelId = $treeItem.children(treeItemLabelSelector).attr(ID_ATTR_NAME);
                    if (labelId) {
                        $treeItem.children(LIST_SELECTOR).attr(ARIA_LABELLEDBY_ATTR, labelId);
                    }
                });
            }
        }, addTreeLabels : function($tree) {
            var self = this;
            var treeLabelId = self.options.treeLabelId;
            if (treeLabelId && $('#' + treeLabelId).length > 0) {
                $tree.attr(ARIA_LABELLEDBY_ATTR,treeLabelId);
            }
            self.addIdToTreeLabels($tree);
        },
        attachToggle : function($tree) {
            if (this.options.insertToggle === false) {return;}

            if (this.options.toggleSelector) {
                $tree.find(this.options.toggleSelector).addClass(TOGGLE_CLASS).attr(ARIA_HIDDEN_ATTR,'true');
            } else {
                var toggleHtml = '';
                if (this.options.customToggle.html) {
                    toggleHtml = this.options.customToggle.html;
                }
                $tree.find(HAS_CHILDREN_CLASS_SELECTOR).prepend('<div class="' + TOGGLE_CLASS  + '" aria-hidden="true">' + toggleHtml + '</div>');
            }
            this.attachToggleClick($tree);
        },
        attachToggleClick : function($tree) {
            var self = this;
            $tree.find(TOGGLE_CLASS_SELECTOR).on(CLICK_EVENT, function(event) {
                var $listItemWithToggle = $(this).parent(LIST_ITEM_SELECTOR);
                self.toggleExpandCollapse($listItemWithToggle, event);
            });
        },
        addMouseNav : function($tree) {
            var self = this;
            $tree.find(LIST_ITEM_SELECTOR).click(function(event) {
                event.stopPropagation();
                self.focusOn($(this), $tree);
            });
        },
        addKeyBoardNav : function($tree) {
            this.focusOn(this.findFirstListItem($tree),$tree);
            this.addTreeToTabOrder($tree);
            this.handleKeys($tree);
        },
        handleKeys : function($tree) {
            var self = this;
            $tree.on(KEYDOWN_EVENT, function(event) {
                var $currentFocusedElement = $tree.find(ITEM_SELECTED_SELECTOR);
                if (_isKey(event, DOWN_ARROW_KEY)) {
                    event.preventDefault();
                    self.handleDownArrowKey($currentFocusedElement, $tree);
                } else if (_isKey(event, UP_ARROW_KEY)) {
                    event.preventDefault();
                    self.handleUpArrowKey($currentFocusedElement, $tree);
                } else if (_isKey(event, RIGHT_ARROW_KEY)) {
                    event.preventDefault();
                    self.handleRightArrowKey($currentFocusedElement, $tree, event);
                } else if (_isKey(event, LEFT_ARROW_KEY)) {
                    event.preventDefault();
                    self.handleLeftArrowKey($currentFocusedElement, $tree, event);
                } else if (_isKey(event, ENTER_KEY)) {
                    self.handleEnterKey($currentFocusedElement, event);
                } else if (_isKey(event, END_KEY)) {
                    event.preventDefault();
                    self.handleEndKey($currentFocusedElement, $tree);
                } else if (_isKey(event, HOME_KEY)) {
                    event.preventDefault();
                    self.handleHomeKey($currentFocusedElement, $tree);
                }
            });
        },
        addTreeToTabOrder : function($tree) {
            $tree.attr(TABINDEX_ATTR_NAME, '0');
        },
        handleLeftArrowKey : function($item, $tree, event) {
            if (this.isExpanded($item)) {
                this.collapse($item, event);
            } else {
                this.focusOn(this.findParent($item), $tree);
            }
        },
        handleRightArrowKey : function($item, $tree, event) {
            if (this.isCollapsed($item)) {
                this.expand($item, event);
            } else if (this.isExpanded($item)) {
                this.focusOn(this.findFirstListItemInSubList($item), $tree);
            }
        },
        handleUpArrowKey : function($item, $tree) {
            var $prevSibling = $item.prev();
            if (this.isExpanded($prevSibling)) {
                this.focusOnLastVisibleElementInTree($prevSibling.children(LIST_SELECTOR), $tree);
            } else if ($item.prev().length === 0) {
                this.focusOn(this.findParent($item), $tree);
            } else {
                this.focusOn($item.prev(), $tree);
            }
        },
        handleDownArrowKey : function($item, $tree) {
            if (this.hasChildren($item) && this.isExpanded($item)) {
                this.focusOn(this.findFirstListItemInSubList($item), $tree);
            } else {
                this.focusOnNextAvailableSiblingInTree($item, $tree);
            }
        },
        handleEnterKey : function($item, event) {
            this.toggleExpandCollapse($item, event);
        },
        handleEndKey : function($item, $tree) {
            this.focusOnLastVisibleElementInTree($tree);
        },
        handleHomeKey : function($item, $tree) {
            this.focusOn(this.findFirstListItem($tree), $tree);
        },
        hasChildren : function($item) {
            return $item.hasClass(HAS_CHILDREN_CLASS);
        },
        focusOn : function($item, $tree) {
            if ($item.length === 1) {
                $tree.find(LIST_ITEM_SELECTOR).attr(ARIA_SELECTED_ATTR,'false');
                $item.attr(ARIA_SELECTED_ATTR,'true');
                $tree.attr(ARIA_ACTIVEDESCENDANT_ATTR, $item.attr(ID_ATTR_NAME));
            }
        },
        focusOnNextAvailableSiblingInTree : function($item, $tree) {
            if ($item.length === 0) {return;}

            if ($item.next().length > 0) {
                this.focusOn($item.next(), $tree);
            } else {
                this.focusOnNextAvailableSiblingInTree(this.findParent($item), $tree);
            }
        },
        focusOnLastVisibleElementInTree: function ($tree, $parentTree) {
            var $lastListItemInTree = $tree.find(LIST_ITEM_SELECTOR).last();
            var $listWithLastListItemInTree = $lastListItemInTree.parent(LIST_SELECTOR);
            if (!this.isParentTree($listWithLastListItemInTree)) {
                $listWithLastListItemInTree = this.findClosestExpandedTree($tree, $lastListItemInTree);
            }
            this.focusOn(this.findLastListItem($listWithLastListItemInTree), $parentTree || $tree);
        },
        findClosestExpandedTree : function($tree, $listItem) {
            var $closestExpandedListItem = $listItem.parent(LIST_SELECTOR).closest(EXPANDED_ITEM_SELECTOR);
            if ($closestExpandedListItem.length === 0) {
                return $tree;
            }

            var $parentOfClosestExpandedListItem = $closestExpandedListItem.parent(LIST_SELECTOR).closest(LIST_ITEM_SELECTOR);
            if ($parentOfClosestExpandedListItem.length === 0 || this.isExpanded($parentOfClosestExpandedListItem)) {
                return $closestExpandedListItem.children(LIST_SELECTOR);
            }
            return this.findClosestExpandedTree($tree, $closestExpandedListItem);
        },
        expand : function($item, event) {
            if (this.options.onExpand) {
                this.options.onExpand($item, event);
            }
            $item.attr(ARIA_EXPANDED_ATTR,'true');
        },
        collapse : function($item, event) {
            if (this.options.onCollapse) {
                this.options.onCollapse($item, event);
            }
            $item.attr(ARIA_EXPANDED_ATTR,'false');
        },
        isExpanded : function($item) {
            return $item.attr(ARIA_EXPANDED_ATTR) === 'true';
        },
        isCollapsed : function($item) {
            return $item.attr(ARIA_EXPANDED_ATTR) === 'false';
        },
        toggleExpandCollapse : function($item, event) {
            if (this.isCollapsed($item)) {
                this.expand($item, event);
            } else {
                this.collapse($item, event);
            }
        },
        isParentTree : function($list) {
            return $list.attr(ROLE_ATTR_NAME) === ARIA_TREE_ROLE;
        },
        findParent : function($item) {
            return $item.parent(LIST_SELECTOR).parent(LIST_ITEM_SELECTOR);
        },
        findLastListItem : function($list) {
            return $list.find(' > li:last-child');
        },
        findFirstListItem : function($list) {
            return $list.find(' > li:first-child');
        },
        findFirstListItemInSubList : function($item) {
            return $item.children(LIST_SELECTOR).find(' > li:first-child');
        },
        identifyListItemWithChildren : function($listItem) {
            this.collapse($listItem);
            $listItem.addClass(HAS_CHILDREN_CLASS);
        },
        identifySubChildren : function($listItem, $parentList, nestingLevel) {
            var $childList = $listItem.children(LIST_SELECTOR);
            if ($childList.length > 0) {
                this.identifyListItemWithChildren($listItem);
                this.identifyChildren($childList, ARIA_GROUP_ROLE, nestingLevel + 1, $parentList);
            } else {
                $listItem.addClass(NO_CHILDREN_CLASS);
            }
        },
        identifyChildren : function($list, listRole, nestingLevel) {
            var self = this;
            $list.attr(ROLE_ATTR_NAME, listRole);
            var $listItems = $list.children(LIST_ITEM_SELECTOR);

            $listItems.attr(ROLE_ATTR_NAME,ARIA_TREEITEM_ROLE).attr(ARIA_LEVEL_ATTR_NAME,nestingLevel);
            $listItems.each(function() {
                self.addIdToListItem($(this), $list, nestingLevel);
                self.identifySubChildren($(this), $list, nestingLevel);
            });
        },
        addIdToListItem : function($listItem, $list) {
            var useId = this.generateListItemId($listItem, $list);
            this.addIdAsDataOrId($listItem, useId);
        },
        addIdAsDataOrId : function($listItem, useId) {
            var existingId = $listItem.attr(ID_ATTR_NAME);
            var nodeLabelIdPrefix = useId;
            if (!existingId) {
                $listItem.attr(ID_ATTR_NAME, useId);
            } else {
                nodeLabelIdPrefix = existingId;
                $listItem.data(ITEM_ID_DATA_ATTR,useId);
            }
            this.addIdToNodeLabel($listItem, nodeLabelIdPrefix);

        },
        addIdToNodeLabel : function($listItem, nodeLabelIdPrefix) {
            var treeItemLabelSelector = this.options.treeItemLabelSelector;
            if (treeItemLabelSelector) {
                var $treeItemLabel = $listItem.children(treeItemLabelSelector);
                var existingId = $treeItemLabel.attr(ID_ATTR_NAME);
                if (!existingId) {
                    $treeItemLabel.attr(ID_ATTR_NAME, nodeLabelIdPrefix + NODE_LABEL_SUFFIX);
                }
            }
        },
        generateListItemId : function($listItem, $list) {
            var id;
            if ($list.parent(LIST_ITEM_SELECTOR).length === 0) {
                id = ITEM_ID_PREFIX + this.treeIdPiece + NODE_ID_PREFIX;
            } else {
                id = $listItem.data(ITEM_ID_DATA_ATTR) || $list.parent(LIST_ITEM_SELECTOR).attr(ID_ATTR_NAME);
            }
            return id + '-' + $list.children(LIST_ITEM_SELECTOR).index($listItem);
        },
        highlightByUrlAndFragment : function($tree, pathName, fragment) {
            var relevantAnchor = $tree.find('a[href*="' + pathName + fragment + '"]:first');
            if(relevantAnchor.length === 1) {
                this.expand(relevantAnchor.parents('li'));
                this.focusOn(relevantAnchor.closest('li'), $tree);
            }
        },
        initMarkActiveOnScroll : function($tree, pathName) {
            var self = this;
            var samePageLinks = [];
            var scrollParents = [];
            var $elements = $tree.find('a[href*="' + pathName + '"]');
            $elements.each(function() {
                var link = this;
                var fragment =link.hash;
                var targetElm = $(fragment) || $(document).find('a[name="' + fragment.substr(1) + '"]');
                if (targetElm.length) {
                    samePageLinks.push({
                        elm: targetElm,
                        link: link,
                        initialOffset: targetElm.offset().top
                    });
                    var parent = targetElm.scrollParent(); // method from jQuery UI
                    if (scrollParents.indexOf(parent) === -1) {
                        scrollParents.push(parent);
                    }
                }
            });
            // sort by offset - sort of gets us document order
            samePageLinks = samePageLinks.sort(function(a,b) {
                return a.initialOffset < b.initialOffset;
            });
            scrollParents.forEach(function(parent) {
                var pastOffset = 0;
                $(parent).scroll(function(evt) {
                    var currentPos = evt.target.scrollTop;
                    if (Math.max(currentPos, pastOffset) - Math.min(currentPos, pastOffset) < 100) {
                        return; // Throttle to avoid calling expensive methods too often
                    }
                    pastOffset = currentPos;
                    for (var i = 0; i < samePageLinks.length; i++) {
                        if (samePageLinks[i].elm.offset().top < 150) {
                            // target element is near or above the fold
                            self.highlightByUrlAndFragment($tree, pathName, samePageLinks[i].link.hash);
                            break;
                        }
                    }
                });
            });
        }
    };

    $.fn[PLUGIN_NAME] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, PLUGIN_PREFIX + PLUGIN_NAME)) {
                $.data(this, PLUGIN_PREFIX + PLUGIN_NAME,
                    new Plugin( this, options ));
            }
        });
    };

    function _isKey(event, key) {
        return event.which === key;
    }

})( jQuery, window, document );
