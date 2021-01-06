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

