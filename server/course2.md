一.使用typerom


二.制造数据库假数据

1.生成migration,将生成的文件放到migration
```
npx typeorm migration:create -n FakePost
```

2.打开并修改
```
public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(``)
})

```

3.在[mockaroo](https://mockaroo.com) 配置对应字段并下载sql,将sql 放到 上面 <code>``</code>中

4. 在index.ts中执行
```
conn.runMigrations()
```

三.数据更新的几种方式
1.QueryBuilder
```
    await getConnection()
    .createQueryBuilder()
    .update(Post)
    .set({ 
       points: () => `'points' + ${realValue}`
    })
    .where("postId = :postId and userId= :userId", {  postId, userId})
    .execute();
 ```

2.query
 ```
    await getConnection().query(`
    START TRANSACTION
    update post 
    set points = points + ${realValue}
    where id = ${postId}
    INSERT INTO `updoot`(`value`, `userId`, `postId`)
    COMMIT
    `)
```

3.update
```
    await Post.update({ id: postId }, { points:  () =>`points +${2* realValue}` })
    await Updoot.update({
    userId,
    postId
    }, { value:  realValue })
```

四、查询
```
    const qb = getConnection().getRepository(Post).createQueryBuilder("p")
    .innerJoinAndSelect("p.creator", "u", 'u.id = p.creatorId')
    .orderBy("p.createdAt", "DESC").take(realLimitPlusOne)
                
    if (cursor) {
        qb.where("p.createdAt < :cursor", {
        cursor: new Date(parseInt(cursor))
        })
    }
    const posts = await qb.getRawMany()

```


失败
```
 `select p.*,
                json_object(
                    'id',u.id,
                    'username',u.username,
                    'email',u.email,
                    'createAt',u."createAt",
                    'updateAt',u."updateAt"
                ) creator,
                ${req.session.userId?`(select value from updoot where userId = ${req.session.userId} and postId = p.id) "voteStatus"`:
                'null as voteStatus'}
                from post p
                inner join user u on u.id = p.creatorId
                ${cursor ? `where p.createAt < ${parseInt(cursor)}` :""}
                order by p.createAt DESC
                limit ${realLimitPlusOne}
```