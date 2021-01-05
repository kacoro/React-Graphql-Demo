
import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Post } from "./Post";


@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({unique:true})
  username!: string;

  @Field()
  @Column({unique:true})
  email!: string;

  @Column()
  password!: string;

  @OneToMany(() =>Post,post =>post.creator)
  posts:Post[]

  @Field(()=> String)
  @CreateDateColumn({type:'timestamp'})
  createdAt =  new Date();

  @Field(()=> String)
  @UpdateDateColumn({type:'timestamp'})
  updatedAt =  new Date();
}