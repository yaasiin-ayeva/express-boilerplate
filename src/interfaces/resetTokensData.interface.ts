export default interface ResetTokensData {
    resetToken: string,
    data : {
        resetPasswordToken: string,
        resetPasswordExpire: number,
    }
}
