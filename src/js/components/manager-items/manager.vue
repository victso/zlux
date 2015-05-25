<script>

    module.exports = {

        data:  {

            currentView: 'items',

            nav: [
                {title: 'Items', view: 'items'}
            ]

        },

        created: function() {

        },

        methods: {

            changeView: function(view) {

                this.currentView = view;
                    
            },

            prevDef: function(e) {

                e.preventDefault();

            }

        },

        components: {

            items: require('./items.vue'),

        }

    };

</script>

<template>

    <nav class="uk-navbar">
        <ul class="uk-navbar-nav">

            <li class="uk-parent uk-active" v-repeat="item: nav">
                <a href="" v-on="click: this.changeView(item.view), click: prevDef"> {{ item.title }}</a>
            </li>

        </ul>
    </nav>

    <div v-component="{{ currentView }}" keep-alive></div>

</template>