<script>

    var _ = require('../../util')

    module.exports = {

        inherit: true,

        data: function() {

            return {

                items: []

            }

        },

        created: function() {

            this.fetchData();

        },

        methods: {

            fetchData: function() {

                var vm = this;

                // this.$http.get();

                UI.$zlux.http.get('/items45').done(function(response) {

                    vm.items = response.items;

                    // console.log(this);

                    // console.log(this);

                }).fail(function(result) {
                    console.log(result);
                })

            }

        }

    };

</script>

<template>

    <table class="uk-table">
        <thead>
            <tr>
                <th>Name</th>
                <th>Type</th>
            </tr>
        </thead>
        <tbody>
            <tr v-repeat="item: items">
                <td>
                    {{ item.name }}
                </td>

                <td>
                    {{ item.type.name }}
                </td>
            </tr>
        </tbody>
    </table>

    <ul class="uk-pagination">
        <li><a href="">...</a></li>
        <li class="uk-active"><span>...</span></li>
        <li class="uk-disabled"><span>...</span></li>
        <li><span>...</span></li>
    </ul>

</template>