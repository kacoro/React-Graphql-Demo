import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";


@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(()=> String)
  @Property({type:'date'})
  createdAt = new Date();

  @Field(()=> String)
  @Property({ type:'date', onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field()
  @Property({unique:true})
  username!: string;

  @Field()
  @Property({unique:true})
  email!: string;

  @Property()
  password!: string;
}