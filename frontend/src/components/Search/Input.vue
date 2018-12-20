<template>
    <input
        type='search'
        name='search'
        :value="value"
        @input="$emit('input', $event.target.value)"
    />
</template>

<script>
export default {
  props: ['value']
}
</script>

<style scoped>

<<<<<<< HEAD
input {
=======
input[type="search"] {
>>>>>>> dev
    margin: auto;
    outline: none;
    font: inherit;
    transition: border 0.3s ease-in;
<<<<<<< HEAD
}

input:active, input:focus {
    border: 1px solid var(--theme-light);
}

input {
=======
    appearance: none;
}

input[type="search"]:active, input[type="search"]:focus {
    border: 1px solid var(--theme-light);
}

input[type="search"] {
>>>>>>> dev
    border-radius: 0.2em;
    border: var(--border);
}

<<<<<<< HEAD
input {
=======
input[type="search"] {
>>>>>>> dev
    padding: 10px 20px;
}

@media screen and (max-width: 740px) {
<<<<<<< HEAD
    input {
=======
    input[type="search"] {
>>>>>>> dev
        padding: 10px;
    }
}

</style>
