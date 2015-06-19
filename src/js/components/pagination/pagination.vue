<script>

    var UI = require('uikit');

    module.exports = {

        replace: true,

        props: ['items', 'items-on-page', 'on-select-page'],

        data:  function() {

            return {
                items          : 1,
                itemsOnPage    : 1,
                currentPage    : 1,
                displayedPages : 3,
                edges          : 3,
                lblPrev        : 'uk-icon-angle-double-left',
                lblNext        : 'uk-icon-angle-double-right'
            }

        },

        computed: {

            totalPages: function() {

                return Math.ceil(this.items / this.itemsOnPage) ? Math.ceil(this.items / this.itemsOnPage) : 1

            }

        },

        created: function() {

            this.$set('currentPage', this.currentPage - 1)

            this.$watch('items', function() {

                // if totalPages changes update currentPage
                if ((this.currentPage + 1) > this.totalPages){

                    this.$set('currentPage', this.totalPages - 1)

                }

            })

        },

        compiled: function() {

            UI.$('a[href="#"]', this.$el).on('click', function(e) {
                e.preventDefault();
            })

        },

        methods: {

            selectPage: function(index) {

                this.$set('currentPage', index)

                this.onSelectPage(index)

            },

            getInterval: function() {

                var pages = this.totalPages, halfDisplayed = this.displayedPages / 2

                return {
                    start: Math.ceil(this.currentPage > halfDisplayed ? Math.max(Math.min(this.currentPage - halfDisplayed, (pages - this.displayedPages)), 0) : 0),

                    end: Math.ceil(this.currentPage > halfDisplayed ? Math.min(this.currentPage + halfDisplayed, pages) : Math.min(this.displayedPages, pages))

                }

            },

            getPages: function() {

                var pages = [], totalPages = this.totalPages, interval = this.getInterval(), i

                // Generate Prev link
                if (this.lblPrev) {
                    pages.push({index: this.currentPage - 1, icon: this.lblPrev})
                }

                if (interval.start > 0 && this.edges > 0) {

                    var end = Math.min(this.edges, interval.start)

                    for (i = 0; i < end; i++) {
                        pages.push({index: i})
                    }

                    if (this.edges < interval.start && (interval.start - this.edges != 1)) {
                        pages.push({text: '...'})
                    } else if (interval.start - this.edges == 1) {
                        pages.push({index: this.edges})
                    }

                }

                for (i = interval.start; i < interval.end; i++) {
                    pages.push({index: i})
                }

                if (interval.end < totalPages && this.edges > 0) {

                    if (totalPages - this.edges > interval.end && (totalPages - this.edges - interval.end != 1)) {
                        pages.push({text: '...'})
                    } else if (totalPages - this.edges - interval.end == 1) {
                        pages.push({index: interval.end++})
                    }

                    var begin = Math.max(totalPages - this.edges, interval.end);

                    for (i = begin; i < totalPages; i++) {
                        pages.push({index: i})
                    }

                }

                // Generate Next link (unless option is set for at front)
                if (this.lblNext) {
                    pages.push({index: this.currentPage + 1, icon: this.lblNext})
                }

                return pages

            }

        },

        components: {

            'page': require('./page.vue')

        }

    }

</script>

<template>

    <ul class="uk-pagination">
        <page v-repeat="getPages()" on-select-page="{{ selectPage }}"></page>
    </ul>

</template>