<template>

    <breadcrumb location="{{ location }}" go-to="{{ goTo }}"></breadcrumb>

    <table class="uk-table">
        <thead>
            <tr>
                <th>File</th>
                <th>Size</th>
            </tr>
        </thead>
        <tbody>
            <tr v-repeat="resource: resources">
                <td v-component="resource" $data="{{ resource }}" root="{{ root }}" on-select-page="{{ goTo }}"></td>
            </tr>
        </tbody>
    </table>

</template>

<script>

    module.exports = {

        inherit: true,

        components: {

            resource: require('./resource.vue'),
            breadcrumb: require('./breadcrumb.vue')

        }

    };

</script>
