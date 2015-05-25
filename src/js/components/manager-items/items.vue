<script>

    module.exports = {

        inherit: true,

        data: function() {

            return {
                
                items: [
                    {name: 'Item 1', type: 'Article'},
                    {name: 'Item 2', type: 'Article'}
                ]
                
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
                    {{ item.type }}
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