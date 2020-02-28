<template>
    <form>
        <div>
            <label>Логин</label>
            <input type="text" minlength="6" maxlength="16" v-model.trim="name" placeholder="Введите логин"
                   class="form-control"/><br>
            <div v-if="nameInvalid">{{errors.name}}</div>
        </div>
        <div>
            <label>Пароль</label>
            <input type="password" minlength="6" maxlength="16" v-model.trim="password" placeholder="Введите пароль"
                   class="form-control"/><br>
            <div v-if="passwordInvalid">{{errors.password}}</div>
        </div>
        <div v-if="response.error">{{response.message}}</div>

        <button @click="loginRequest">Войти</button>
        <button @click="registerRequest">Зарегистрироваться</button>



    </form>
</template>

<script>

    export default {
        name: "Form",
        data() {
            return {

                action: '',
                errors: {
                    name: '',
                    password: '',
                },
                response: {
                    error: false,
                    message: ''
                },
                success: '',
                name: null,
                password: null,
                nameInvalid: false,
                passwordInvalid: false,
                BaseURL: "http://localhost:8030/api/users",

            }


        },
        methods: {
            checkForm: function () {

                console.log("123");
                if (!this.name) {
                    console.log("опа нет имени ");
                    this.nameInvalid = true;
                    console.log("укажите имя ");
                    this.errors.name = 'Укажите имя';
                    console.log(this.errors.name)
                } else if (!this.name.match(/^[A-Za-z0-9]*$/)) {

                    this.nameInvalid = true;
                    this.errors.name = 'Только латинские буквы и цифры';
                    console.log(this.errors.name)
                } else {
                    this.nameInvalid = false;
                }

                if (!this.password) {
                    this.passwordInvalid = true;
                    this.errors.password = 'Укажите пароль';
                } else if (!this.password.match(/^[A-Za-z0-9]*$/)) {
                    this.passwordInvalid = true;
                    this.errors.password = 'Только латинские буквы и цифры';
                } else {
                    this.passwordInvalid = false;
                }
            },
            registerRequest: function (e) {
                e.preventDefault();
                this.checkForm();
                if (this.nameInvalid === false && this.passwordInvalid === false) {
                    this.$axios({
                        method: 'post',
                        url: this.BaseURL,
                        headers: {'Content-Type': 'application/json'},
                        data: {
                            login: this.name,
                            password: this.password,
                            type: "registration"
                        }
                    }).then((data) => {
                        let response = data.data;
                        if (response.error) {
                            this.response.error = true;
                            this.response.message = response.message;
                        } else {
                            let token = response.token;
                            alert(response.message);
                            localStorage.setItem('token', token);
                            this.$router.push('/main')
                        }
                    })
                }
            },
            loginRequest: function (e) {
                e.preventDefault();
                this.checkForm();
                if (this.nameInvalid === false && this.passwordInvalid === false) {
                    this.$axios({
                        timeout: 500,
                        method: 'post',
                        url: this.BaseURL,
                        data: {
                            login: this.name,
                            password: this.password,
                            type: "login"
                        }
                    }).then((data) => {
                        let response = data.data;
                        if (response.error) {
                            this.response.error = true;
                            this.response.message = response.message;
                        } else {
                            let token = response.token;
                            localStorage.setItem('token', token);
                              this.$router.push('/main');
                        }
                    })
                }
            }

        }
    }
</script>

<style scoped>
    #nameerror {
        width: 100px;
        height: 100px;
        background-color: #42b983;

    }

</style>