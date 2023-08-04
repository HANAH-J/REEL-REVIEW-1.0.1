package com.reelreview.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.reelreview.domain.user.UserEntity;

// @Repository 어노테이션이 없어도 Ioc 가능 (JpaRepository(CRUD 함수 포함)를 상속했기 때문)
public interface UserRepository extends JpaRepository<UserEntity, Integer> {
                                                  // <Entity, PRIMARY KEY TYPE>
    // findBy 규칙 -> UserName 문법
    // select * from member where userName = 1?

    public UserEntity findByUsername(String username);

    public UserEntity findByUserEmail(String userEmail);

    // [프로필] userCd를 통해 userEntity 조회
    public UserEntity findByUserCd(int userCd);

    // [회원가입] 이메일 중복 조회
    public boolean existsByUserEmail(String userEmail);
}
