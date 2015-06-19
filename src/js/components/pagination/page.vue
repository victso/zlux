<script>

    module.exports = {

        replace: true,
        inherit: true,
        props: ['on-select-page'],

        data: function() {

            return {
                index: null,
                text: '',
                icon: ''
            }

        },

        computed: {

            isCurrent: function() {

                return this.index == this.currentPage

            },

            page: function() {

                return this.index + 1

            },

            content: function() {

                return this.icon ? '' : (this.text || this.page)

            },

            href: function() {

                return this.index !== null ? '#page-' + this.page : ''
            }

        },

        created: function() {

            this.$set('index', this.index < 0 ? 0 : (this.index < this.totalPages ? this.index : this.totalPages - 1))

        }

    }

</script>

<template>

    <li v-class="uk-active: isCurrent">

        <span v-if="isCurrent || index === null">
            <i v-if="icon" v-class="icon"></i>{{ content }}
        </span>

        <a href="{{ href }}" v-if="!isCurrent && href" v-on="click: onSelectPage(index)">
            <i v-if="icon" v-class="icon"></i>{{ content }}
        </a>

    </li>

</template>