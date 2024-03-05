const safeUser=(mongoosedocument)=>{
    let userWithoutPasswordEmailID = { ...mongoosedocument.toObject() };
    delete userWithoutPasswordEmailID.password;
    delete userWithoutPasswordEmailID._id;
    delete userWithoutPasswordEmailID.token;
    return userWithoutPasswordEmailID;
}

export {safeUser};