package com.reelreview.domain;

public class CommentUserDTO {
    private String PFImage;
    private String userName;

    public CommentUserDTO(){}
    public CommentUserDTO(int userCd, int commentId, String PFImage, String userName) {

        this.PFImage = PFImage;
        this.userName = userName;
    }


    public String getPFImage() {
        return PFImage;
    }

    public void setPFImage(String PFImage) {
        this.PFImage = PFImage;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
}
