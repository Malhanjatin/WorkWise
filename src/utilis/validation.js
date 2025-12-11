

export function isValidEmail(email){
    const emailRegax= /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegax.test(email)
}

export function isValidPassword(password){
    return {
        length:password.length>=8,
        upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*]/.test(password),
    }
}