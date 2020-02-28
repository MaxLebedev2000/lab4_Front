<template>
    <div>
        <Form @redraw="X++" @drawPoint="R++" @drawTableForm="E++"/>
        <Canvas :isRedraw="X" :isDrawPoint="R" @drawTableCanvas="M++"/>
        <Table :isDrawTableForm="E" :isDrawTableCanvas="M"/>
    </div>
</template>

<script>
    import Form from "./mainpage/form/Form.vue";
    import Canvas from "./mainpage/canvas/Canvas.vue"
    import Table from "./mainpage/table/Table.vue"

    export default {

        name: "Main",
        data() {
            return {
                X: 0,
                R: 0,
                E: 0,
                M: 0
            }
        },
        components: {
            Form,
            Canvas,
            Table

        },
        mounted: async function () {
            let response = await this.$axios({
                timeout: 500,
                method: 'get',
                headers: {'Content-Type': 'application/json', 'token': localStorage.getItem('token')},
                url: "http://localhost:8030/api/auth",
            }).then((data) => {
                let response = data.data;
                console.log(response);
                return response;

            })
            if (response.auth === "failed"){
                alert("Для отправки точек необходимо авторизаваться!!!");
                this.$router.push('/')
            }


        },
    }
</script>

<style scoped>
    @media only screen and (max-width: 695px) {
        Canvas{
        }
        Form{
        }
        Table{
        }



    }


    @media only screen and (max-width: 1216px) and (min-width: 696px) {

        Canvas{

        }
        Form{

        }
        Table{
            /*width: 500px;*/
            /*height: 400px;*/
            /*overflow-y: auto;*/
            /*overflow-x: hidden;*/
            /*background: white;*/
            /*margin: 0 auto;*/
        }

    }


    @media only screen and (min-width: 1217px) {
        Canvas{
            position: fixed;
            top: 30%;
            right: 20%;
        }
        Form{
            position: fixed;
            top: 10%;
            left: 10%;
        }
        Table{
            /*width: 500px;*/
            /*height: 400px;*/
            /*overflow-y: auto;*/
            /*overflow-x: hidden;*/
            /*background: white;*/
            /*margin: 0 auto;*/
        }

    }

</style>