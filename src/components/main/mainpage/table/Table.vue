<template>
    <div class="table-container">
        <table class="res-table"  border="3">
            <tr>
                <th>X</th>
                <th>Y</th>
                <th>R</th>
                <th>Результат</th>
            </tr>
            <tr  v-for="point in points.slice().reverse()" v-bind:key="point" >
                <td>{{point.x}}</td>
                <td>{{point.y}}</td>
                <td>{{point.r}}</td>
                <td>{{point.result? "Попадание" : "Мимо"}}</td>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        name: "Table",
        data() {
            return {
                points: []
            }
        },

        props: ['isDrawTableForm', 'isDrawTableCanvas'],
        watch: {

            isDrawTableForm: function () {
                this.getPoint();
            },
            isDrawTableCanvas: function () {
                this.getPoint();
            }

        },

        methods: {
            async getPoint() {
                this.points = await this.drawTable();

            },
            drawTable() {
                return this.$axios({
                    method: 'get',
                    url: "http://localhost:8030/api/points",
                    headers: {'Content-Type': 'application/json', 'token': localStorage.getItem('token')},
                }).then((data) => {
                    return data.data;
                }).catch(
                    (error) => {
                        alert(error)
                    }
                );
            }


        }

    }
</script>

<style scoped>
    @media only screen and (max-width: 695px) {
        .table-container{
            display: flex;
            justify-content: flex-end;
            height: 200px;
            overflow-y: auto;
        }
        .res-table{
            padding: 10px;
            border: 3px;
            width: 100%;
        }

        body{
            background: dimgray;
            text-align: center;
        }

    }


    @media only screen and (max-width: 1216px) and (min-width: 696px) {


        .table-container{
            display: flex;
            justify-content: flex-end;
            height: 200px;
            overflow-y: auto;
        }
        .res-table{
            padding: 10px;
            border: 3px;
            width: 100%;
        }

        body{
            background: dimgray;
            text-align: center;
        }

    }


    @media only screen and (min-width: 1217px) {
       .table-container{
           display: flex;
           justify-content: flex-end;
           height: 400px;
           overflow-y: auto;
       }
        .res-table{
            padding: 10px;
            border: 3px;
            width: 100%;
        }

        body{
            background: dimgray;
            text-align: center;
        }

    }

</style>