<template>

    <ul class="uk-pagination">
        <page v-repeat="getPages()"></page>
    </ul>

</template>

<script>

    var $ = require('jquery');

    module.exports = {

        props: {
            'currentPage': {
                type: Number,
                default: 1
            },
            'items': {
                type: Number,
                required: true
            },
            'itemsOnPage': {
                type: Number,
                required: true
            },
            'onSelectPage': {
                type: Function
            }
        },

        data: function() {

            return {
                items: 1,
                itemsOnPage: 1,
                displayedPages: 3,
                edges: 3,
                lblPrev: 'uk-icon-angle-double-left',
                lblNext: 'uk-icon-angle-double-right'
            };

        },

        computed: {

            totalPages: function() {

                return Math.ceil(this.items / this.itemsOnPage)
                    ? Math.ceil(this.items / this.itemsOnPage)
                    : 1;

            },

            currentIndex: function() {
                return this.currentPage - 1;
            }

        },

        methods: {

            selectPage: function(page) {
                // execute callback
                if (this.onSelectPage) {
                    this.onSelectPage(page);
                }
            },

            getInterval: function() {

                var pages = this.totalPages, halfDisplayed = this.displayedPages / 2;

                return {
                    start: Math.ceil(this.currentIndex > halfDisplayed
                        ? Math.max(Math.min(this.currentIndex - halfDisplayed, (pages - this.displayedPages)), 0)
                        : 0),

                    end: Math.ceil(this.currentIndex > halfDisplayed
                        ? Math.min(this.currentIndex + halfDisplayed, pages)
                        : Math.min(this.displayedPages, pages))

                };

            },

            getPages: function() {

                var pages = [], totalPages = this.totalPages, interval = this.getInterval(), i;

                // Generate Prev link
                if (this.lblPrev) {
                    pages.push({index: this.currentIndex - 1, icon: this.lblPrev});
                }

                if (interval.start > 0 && this.edges > 0) {

                    var end = Math.min(this.edges, interval.start);

                    for (i = 0; i < end; i++) {
                        pages.push({index: i});
                    }

                    if (this.edges < interval.start && (interval.start - this.edges != 1)) {
                        pages.push({text: '...'});
                    } else if (interval.start - this.edges == 1) {
                        pages.push({index: this.edges});
                    }

                }

                for (i = interval.start; i < interval.end; i++) {
                    pages.push({index: i});
                }

                if (interval.end < totalPages && this.edges > 0) {

                    if (totalPages - this.edges > interval.end && (totalPages - this.edges - interval.end != 1)) {
                        pages.push({text: '...'});
                    } else if (totalPages - this.edges - interval.end == 1) {
                        pages.push({index: interval.end++});
                    }

                    var begin = Math.max(totalPages - this.edges, interval.end);

                    for (i = begin; i < totalPages; i++) {
                        pages.push({index: i});
                    }

                }

                // Generate Next link (unless option is set for at front)
                if (this.lblNext) {
                    pages.push({index: this.currentIndex + 1, icon: this.lblNext});
                }

                return pages;

            }

        },

        components: {
            'page': require('./page.vue')
        }

    }

</script>
