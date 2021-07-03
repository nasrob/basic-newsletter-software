document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('form').addEventListener('submit', (event) => {
        event.stopPropagation()
        event.preventDefault()

        const name = document.querySelectorAll('form input[name="name"]')[0].value
        const email = document.querySelectorAll('form input[name="email"]')[0].value

        if (!validator.isAlphanumeric(name) || !validator.isLength(name, { min: 3, max: 100 })) {
            alert('Name must be alphanumeric and between 3 and 100 chars')
            return
        }

        axios.post('/form', { name, email })
    })
})