import { EntityRepository, Repository } from "typeorm";
import { User } from "../entities/user.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async findAll () {
        return this.createQueryBuilder('user').where('user.is_active = true').getMany()
    }
}