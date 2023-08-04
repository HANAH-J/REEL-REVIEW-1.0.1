package com.reelreview.repository;

import com.reelreview.domain.ProfileDTO;
import com.reelreview.domain.user.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


// Repository는 인터페이스로 생성, 상속받을 인터페이스는 JpaRepository, @Repository springframework 어노테이션을 추가해준다
// 주로 데이터 조회, 추가, 수정, 삭제, 검색, 필터링 등을 수행
// JpaRepository는 Spring Data JPA 프레임워크에서 제공하는 인터페이스,
// 기본적인 CRUD 및 데이터 액세스를 편리하게 도와준다. 이 인터페이스를 상속받아 사용하면 개발자는 별도의 구현 없이 간편하게 데이터베이스와 상호작용할 수 있다.
// save(entity): 엔티티를 저장하거나 업데이트 / findById(id): 주어진 id로 엔티티를 조회 / findAll(): 모든 엔티티를 조회 /
// delete(entity): 엔티티를 삭제 / count(): 엔티티의 총 개수를 반환
@Repository
public interface ProfileRepository extends JpaRepository<ProfileDTO, Integer> { //제너릭 첫번째는 entity클래스명, 두번째는 entity primary키의 타입

    public ProfileDTO findByUserCd(UserEntity userCd);
    ProfileDTO findProfileDTOByUserCd(int userId);
}