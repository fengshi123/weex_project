create table if not exists t_exam(
  exam_id int primary key AUTO_INCREMENT,
  uid varchar(16),
  name varchar(32),
  create_time varchar(32)
) default charset = utf8;

insert into t_exam values(1,'1','试卷1','2019-07-02');
insert into t_exam values(2,'1','试卷2','2019-07-02');

create table if not exists t_question(
  question_id int,
  exam_id int,
  type int,
  stem varchar(512),
  stem_img varchar(512),
  result_options varchar(512),
  result varchar(64),
  PRIMARY KEY (question_id,exam_id)
) default charset = utf8;

insert into t_question values(1,1,0,'我是一题单选题','https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=118955218,1401459922&fm=26&gp=0.jpg|https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=118955218,1401459922&fm=26&gp=0.jpg','A选项|B选项|C选项|D选项','B');
insert into t_question values(2,1,2,'我是一题判断题','','Y选项|N选项','Y');
insert into t_question values(3,1,1,'我是一道多选题','','A选项|B选项|C选项|D选项','A|B');
insert into t_question values(4,1,3,'我是一道填空题________','','','xxxxx');

create table if not exists t_answer(
  uid varchar(16),
  question_id int,
  exam_id int,
  answer varchar(64)
) default charset = utf8;

insert into t_answer values('1',1,1,'B');
insert into t_answer values('1',2,1,'N');

commit;

