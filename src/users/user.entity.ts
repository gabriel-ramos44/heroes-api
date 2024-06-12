import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity()
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ unique: true })
  cpf: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  profilePhoto?: string;

  @Column({ nullable: true })
  biography?: string;
}