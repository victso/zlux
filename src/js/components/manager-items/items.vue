<script>

    module.exports = {

        inherit: true,

        data: function() {

            return {

                items: []

            }

        },

        created: function() {

            // this.fetchData('root');

        },

        methods: {

            fetchData: function(path) {

                this.$http.get('/items', {path:path}, function(response) {

                    this.items = response.data;

                }).error(function(e) {

                    console.log(e);

                });

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