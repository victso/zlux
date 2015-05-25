<script>

    module.exports = {

        paramAttributes: ['path'],

        data: function() {

            return {
                
                path: ''
                
            }

        },

        computed: {

            crumbs: function() {

                var parts = this.path.replace(/^[\/]|[\/]$/gm, ''), crumbs = [];

                if (parts.length > 1) {

                    var path = '/';

                    parts.split('/').forEach(function(part) {

                        crumbs.push({
                            'name': part,
                            'path': path += part + '/'
                        });

                    });
                    
                }

                crumbs.unshift({
                    'name': 'root',
                    'path': '/'
                });   

                return crumbs;

            }
        },

        directives: {

            'ifactive': {

                isLiteral: true,

                update: function () {

                    if (this.expression == true) {

                        $(this.el).addClass('uk-active').find('a').remove();
                        $(this.el).append($('<span />').html(this.vm.name));

                    }

                }

            }

        }

    };

</script>

<template>

    <li v-repeat="crumbs" v-ifactive="{{ path == $parent.path }}">
        
        <a href="#" v-on="click: $parent.$parent.goTo(path)">{{ name }}</a>

    </li>

</template>