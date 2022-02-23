const UserService = (() => {
    async function createUser(user_name:string, password:string) {
        console.log('登陆成功')
    }
    return {
        createUser
    }
})()

export default UserService
