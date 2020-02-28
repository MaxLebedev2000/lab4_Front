<template>


    <form id='form'>

        <label>X</label> <br>
        <input type="checkbox" id="-5" value="-5" v-model="checkedX" @change="selectX">
        <label for="-5">-5</label>
        <input type="checkbox" id="-4" value="-4" v-model="checkedX" @change="selectX">
        <label for="-4">-4</label>
        <input type="checkbox" id="-3" value="-3" v-model="checkedX" @change="selectX">
        <label for="-3">-3</label>
        <input type="checkbox" id="-2" value="-2" v-model="checkedX" @change="selectX">
        <label for="-2">-2</label>
        <input type="checkbox" id="-1" value="-1" v-model="checkedX" @change="selectX">
        <label for="-1">-1</label>
        <input type="checkbox" id="0" value="0" v-model="checkedX" @change="selectX">
        <label for="0">0</label>
        <input type="checkbox" id="1" value="1" v-model="checkedX" @change="selectX">
        <label for="1">1</label>
        <input type="checkbox" id="2" value="2" v-model="checkedX" @change="selectX">
        <label for="2">2</label>
        <input type="checkbox" id="3" value="3" v-model="checkedX" @change="selectX">
        <label for="3">3</label>


        <br>
        <div class="error" v-if="xNotNorm">{{xError}}</div>
        <br>

        <label>Y</label> <br>
        <input type="text" v-model.trim="y" maxlength="6" placeholder="-2" @change="checkY" required="true"
               class="form-control"/>
        <br>
        <div class="error" v-if="yNotNorm">{{yError}}</div>
        <br>

        <div>
            <label>R </label> <br>
            <input type="checkbox" disabled>-5
            <input type="checkbox" disabled>-4
            <input type="checkbox" disabled>-3
            <input type="checkbox" disabled>-2
            <input type="checkbox" disabled>-1
            <input type="checkbox" id="zero" class="r-box" value="0" v-model="checkedR" @change="selectR">
            <label for="zero">0</label>
            <input type="checkbox" id="one" class="r-box" value="1" v-model="checkedR" @change="selectR">
            <label for="one">1</label>
            <input type="checkbox" id="two" class="r-box" value="2" v-model="checkedR" @change="selectR">
            <label for="two">2</label>
            <input type="checkbox" id="three" class="r-box" value="3" v-model="checkedR" @change="selectR">
            <label for="three">3</label>
            <br>
            <div class="error" v-if="rNotNorm">{{rError}}</div>
            <br>
            <button id="submit" @click="submit">Проверить</button>
            <button id="exit" @click="goStart">Выйти</button>

        </div>
        <br>
    </form>

</template>

<script>

    export default {
        name: "Form",
        data() {
            return {
                checkedX: ["1"],
                y: '',
                checkedR: ["3"],
                firstR: 1,
                yError: '',
                yNotNorm: false,
                xError: '',
                xNotNorm: false,
                rError: '',
                rNotNorm: false,
            }
        },
        mounted: function () {
            localStorage.setItem('checkedR', 3);
            this.$emit("drawTableForm");


        },

        methods: {
            selectR: function (e) {
                e.preventDefault();
                let lastR = this.checkedR.pop();
                localStorage.setItem('checkedR', lastR);
                this.$emit("redraw");
                this.checkedR = [lastR];
                if (lastR == null) {
                    this.rNotNorm = true;
                    this.rError = "Выберете один из чекбоксов для R";
                } else {
                    this.rNotNorm = false;
                    this.rError = "";
                }
            },
            selectX: function (e) {
                e.preventDefault();
                let lastX = this.checkedX.pop();
                this.checkedX = [lastX];
                if (lastX == null) {
                    this.xNotNorm = true;
                    this.xError = "Выберете один из чекбоксов для X";
                } else {
                    this.xNotNorm = false;
                    this.xError = "";
                }
            },
            checkY: function () {
                this.y = this.y.replace(',', '.');
                if (isNaN(this.y)) {
                    this.yNotNorm = true;
                    this.yError = "Значение Y должно быть числом";
                } else if (!(this.y > -5 && this.y < 3)) {
                    this.yNotNorm = true;
                    this.yError = "Значение Y должно быть в промежутке (-5; 3)";
                } else if (this.y === '') {
                    this.yNotNorm = true;
                    this.yError = "Заполните поле Y";

                } else {
                    this.yNotNorm = false;
                    this.yError = "";
                }
            },
            goStart: function () {
                localStorage.removeItem("token");
                this.$router.push('/')
            },
            async submit() {
                if ((!(this.xNotNorm) && !(this.yNotNorm) && !(this.rNotNorm)) && !(this.y == '') && !(this.checkedR == '') && !(this.checkedX == '')) {
                    let response = await this.$axios({
                        timeout: 500,
                        method: 'post',
                        headers: {'Content-Type': 'application/json', 'token': localStorage.getItem('token')},
                        url: "http://localhost:8030/api/points",
                        data: {
                            x: this.checkedX[0],
                            y: this.y,
                            r: this.checkedR[0]
                        }
                    }).then((data) => {
                        let response = data.data;
                        return response;
                    }).catch((error) => alert(error));
                    if (response.auth === "failed") {
                        alert("Для отправки точек необходимо авторизаваться!!!");
                    } else {
                        localStorage.setItem('response', response);
                        this.$emit("drawPoint");
                        this.$emit("drawTableForm");
                    }
                }
            }

        }
    }
</script>

<style scoped>
    .error {
        color: red;
    }

    @media only screen and (max-width: 695px) {
        form {
        }
    }

    @media only screen and (max-width: 1216px) and (min-width: 696px) {
    }

    @media only screen and (min-width: 1217px) {
    }

</style>