<template>
    <div >
        <AuthInfo/>
        <Form/>
    </div>

</template>

<script>
    import AuthInfo from './startpage/authinfo/AuthInfo.vue';
    import Form from './startpage/form/Form.vue';

    export default {
        name: "Start",
        components: {
            Form,
            AuthInfo

        }

    }
</script>

<style scoped>

Form{
    margin: 5%;
}
</style>