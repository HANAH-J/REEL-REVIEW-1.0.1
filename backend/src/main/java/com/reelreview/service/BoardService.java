package com.reelreview.service;

import com.reelreview.domain.board.BoardCommentDTO;
import com.reelreview.domain.board.BoardDTO;
import com.reelreview.repository.BoardCommentRepository;
import com.reelreview.repository.BoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;
import java.util.UUID;

@Service
public class BoardService {

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private BoardCommentRepository boardCommentRepository;

    // 글 작성 처리
    public void write(BoardDTO boardDTO, MultipartFile file) throws Exception{

        String projectPath = System.getProperty("user.dir") + "\\src\\main\\resources\\static\\files";  //파일 경로지정

        UUID uuid = UUID.randomUUID(); // 파일에 붙일 랜덤 이름 생성
        if(file==null){

        }else{
            String fileName = uuid+ "_" + file.getOriginalFilename(); // 랜덤이름 + _ + 오리지널네임

            File saveFile = new File(projectPath, fileName); // 경로지정, 파일이름

            file.transferTo(saveFile);
            boardDTO.setFilename(fileName);
            boardDTO.setFilepath("/files/" + fileName);
        }




        boardRepository.save(boardDTO);
    }

    // 게시물 리스트
    public Page<BoardDTO> boardDTOList(Pageable pageable) {

        return boardRepository.findAll(pageable);

    }

    // 게시물 제목, 작성자 검색
    public Page<BoardDTO> boardSearchList(String searchKeyword, Pageable pageable) {
        return boardRepository.findByTitleContainingOrWriterContaining(searchKeyword, searchKeyword, pageable);
    }

    // 특정 게시글 불러오기
    public BoardDTO boardView(Integer boardCd) {
        return boardRepository.findById(boardCd).orElse(null);
    }

    // 특정 게시글 삭제

    public void boardDelete(Integer boardCd) {

        boardRepository.deleteById(boardCd);
    }

    // 게시글 댓글
    public void writeComment(BoardCommentDTO boardCommentDTO) {

        boardCommentRepository.save(boardCommentDTO);
    }

    // 게시글 댓글 가져오기
    @Autowired
    public BoardService(BoardCommentRepository boardCommentRepository) {
        this.boardCommentRepository = boardCommentRepository;
    }

    public List<BoardCommentDTO> getComments(Integer boardcd) {
        // JPA Repository를 사용하여 댓글 데이터를 가져옴
        return boardCommentRepository.findByBoardcd(boardcd);
    }

    public List<BoardDTO> findByBoardWriter(String writer) {

        return boardRepository.findByWriter(writer);
    }

}


