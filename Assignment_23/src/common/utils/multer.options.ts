import { diskStorage } from "multer"

export const uploadFile = ({
    dest = "general",
})=>{
    return{
        storage: diskStorage({
            destination: `uplaods/${dest}`,
            filename: (req, file, cb)=>{
                const filename = `${Date.now()}_${file.originalname}`
                cb(null, filename)
            }
        })
    }
}
