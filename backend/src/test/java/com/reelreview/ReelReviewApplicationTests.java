package com.reelreview;

import com.reelreview.domain.board.BoardDTO;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
class ReelReviewApplicationTests {

    @Test
    public void testDelete() {

        System.out.println("DELETE Entity ====== ");

    }

    @Test
    public void testInsert200() {
        for (int i = 1; i <= 200; i++) {
            BoardDTO board = new BoardDTO();
            board.setTitle("제목.." + i);
            board.setContent("내용...." +  i + " 채우기 ");
            board.setWriter("user0" + (i%10) );

        }
    }


}




