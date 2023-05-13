import bcrypt from 'bcrypt'
export const passwordHashing = async(password)=>{
    try{
        const saltTurn = 10
        const hPass = bcrypt.hash(password,saltTurn);
        return hPass
    }
    catch(err){
        console.log(err)
    }
}

export const comparePassword = async(password,hashPass)=>{
    try{
        return bcrypt.compare(password,hashPass)
    }
    catch(err){
        console.log(err)
    }
}

export const generateTuitionId = (length,name)=>{
    const random = Math.floor(Math.random()*100 +3);
    return "TUI"+length+random+name.slice(0,2).toUpperCase()
}

export const generateStudentId = (name,tuition_id)=>{
    const random = Math.floor(Math.random()*100 +3);
    return "S"+random+name.slice(0,3).toUpperCase()+tuition_id
}