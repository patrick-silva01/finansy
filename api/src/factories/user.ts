import { define, sequence } from "cooky-cutter";
import { UserDTO } from "../users/dto/user.dto";

//Utilities
import { generateString } from "./utilities/random-string";
import { generateNumber } from "./utilities/ramdom-number";

export const user = define<UserDTO>({
    id: sequence,
    first_name: generateString(5),
    last_name: generateString(5),
    email: generateString(5) + '@teste.com',
    password: generateString(8),
    is_active: true,
    created_at: () => { return new Date() },
    updated_at: () => { return new Date() }
})