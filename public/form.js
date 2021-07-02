document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('form').addEventListener('submit', (event) => {
        event.stopPropagation()
        event.preventDefault()

        const name = document.querySelectorAll('form input[name="name"]')[0].value
        const email = document.querySelectorAll('form input[name="email"]')[0].value

        axios.post('form', { name, email })
    })
})