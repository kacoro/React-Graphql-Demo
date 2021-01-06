
import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity,  Column,  Entity, ManyToOne, PrimaryColumn } from "typeorm";

import { User } from "./User";
import { Post } from "./Post";
// m to n
// many to many
// user <-> post
// user ->join table <- posts
// user -> updoot <- post

@Entity()
@ObjectType()
export class Updoot extends BaseEntity {
  @Field(() => Int)
  @Column()
  value:number

  @Field(() => Int)
  @PrimaryColumn()
  userId: number;

  
  @ManyToOne(() => User,(user) =>user.updoots)
  user:User

  @Field()
  @PrimaryColumn()
  postId:number;

 
  @ManyToOne(() => Post,(post) =>post.updoots)
  post:Post

}