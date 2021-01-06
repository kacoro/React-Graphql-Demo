
import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";


@Entity()
@ObjectType()
export class Post extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  creatorId:number;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column({type:"longtext"})
  text!: string;

  @Field()
  @Column({type:"int",default:0})
  points!: number;

  @ManyToOne(() => User,user =>user.posts)
  creator:User

 

  @Field(()=> String)
  @CreateDateColumn({type:'timestamp',length:''})
  createdAt = new Date();

  @Field(()=> String)
  @UpdateDateColumn({type:'timestamp',length:''})
  updatedAt = new Date();

 

 
}