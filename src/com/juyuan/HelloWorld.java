package com.juyuan;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class HelloWorld extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        System.out.println("111111111");
        System.out.println("git 的分支");
        System.out.println("呵呵呵");
        System.out.println("我是 0825");
        System.out.println("有问题 ");

       System.out.println("添加的");

        System.out.println("再来一次");
        System.out.println("我修改了0825");
        System.out.println("重读了吗  ,我们都不爱了");
        
        

    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        System.out.println("222222");
    }
}
