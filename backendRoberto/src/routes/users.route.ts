import { response, Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import CreateUserService from '../service/CreateUserService';
import UpdateUserAvatarService from '../service/UpdateUserAvatarService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig)

interface User {
    name: string;
    password?: string;
    email: string;
}

usersRouter.post('/', async (request, response) => {

    const { name, email, password } = request.body;

    const createUser = new CreateUserService();

    const user: User = await createUser.execute({
        name,
        email,
        password,
    })

    delete user.password;

    return response.json(user );

})

usersRouter.patch('/avatar',ensureAuthenticated, upload.single('avatar'), async (request, response) => {

    
        const updateUserAvatar = new UpdateUserAvatarService();

        const user = await updateUserAvatar.execute({
            user_id: request.user.id,
            avatarFileName: request.file.filename,
        });

        return response.json(user)


})

export default usersRouter;
