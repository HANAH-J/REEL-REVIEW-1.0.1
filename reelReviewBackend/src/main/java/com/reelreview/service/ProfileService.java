package com.reelreview.service;

import com.reelreview.domain.ProfileDTO;
import com.reelreview.domain.user.UserEntity;
import com.reelreview.repository.ProfileRepository;
import com.reelreview.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.EntityNotFoundException;
import java.io.File;
import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
public class ProfileService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private final ProfileRepository profileRepository;
    @Autowired
    private UserService userService;
    @Autowired
    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public UserEntity getCurrentUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null) {
            System.out.println("Authentication is null");
            return null;
        }

        String userEmail = (String) authentication.getPrincipal();
        UserEntity userEntity = userRepository.findByUserEmail(userEmail);

        if (userEntity != null) {
            return userEntity;
        } else {
            System.out.println("UserEntity is null");
        }
        return null;
    }

    public ProfileDTO getProfileByUserCd(UserEntity userCd) {
        ProfileDTO profileDTO = profileRepository.findByUserCd(userCd);
        return profileDTO;
    }

    public void saveProfile(ProfileDTO profileDTO) {
        profileRepository.save(profileDTO);
    }

    public void updateProfileStatus(int userCd, String newStatus) {
        UserEntity userEntity = userService.getUserByUserCd(userCd);
        if(userEntity == null) {
            throw new EntityNotFoundException("User not found with userCd : " + userCd);
        }
        ProfileDTO profileDTO = getProfileByUserCd(userEntity);
        if(profileDTO != null) {
            profileDTO.setStatus(newStatus);
            saveProfile(profileDTO);
        } else {
            throw new EntityNotFoundException("Profile not found for userCd : " + userCd);
        }
    }

    public ResponseEntity<?> uploadImage(String fileType, int userCd, MultipartFile image) {
        if (!image.isEmpty()) {
            // 파일 업로드 용량 제한
            long maxFileSize = 2 * 1024 * 1024; // 프로필 사진의 경우, 2MB
            if (fileType.equals("background")) {
                maxFileSize = 3 * 1024 * 1024; // 배경 사진의 경우, 3MB
            }
            if (image.getSize() > maxFileSize) {
                return ResponseEntity.badRequest().body("File size exceeds the maximum limit");
            }

            try {
                String filePath;
                if (fileType.equals("profile")) {
                    filePath = setProfilePicturePath(userCd, image);
                } else { // fileType.equals("background")
                    filePath = setBackgroundPath(userCd, image);
                }
                UserEntity userEntity = userService.getUserByUserCd(userCd);
                if (userEntity == null) {
                    return ResponseEntity.notFound().build();
                }
                ProfileDTO profileDTO = getProfileByUserCd(userEntity);
                if (profileDTO != null) {
                    if (fileType.equals("profile")) {
                        profileDTO.setPfImage(filePath);
                    } else { // fileType.equals("background")
                        profileDTO.setBgImage(filePath);
                    }
                    saveProfile(profileDTO);
                    return ResponseEntity.ok("Profile " + fileType + " uploaded successfully");
                } else {
                    return ResponseEntity.notFound().build();
                }
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating profile " + fileType);
            }
        } else {
            return ResponseEntity.badRequest().body("No file selected.");
        }
    }

    public String setProfilePicturePath(int userCd, MultipartFile profilePicture) throws IOException {
        String uploadDir = System.getProperty("user.dir") + "\\src\\main\\resources\\static\\profilePictures\\";
        String fileName = UUID.randomUUID() + "_" + userCd + "_" + profilePicture.getOriginalFilename();
        String filePath = uploadDir + fileName;

        File dest = new File(filePath); // 업로드된 파일을 저장할 파일 경로를 나타내는 File 객체 생성
        profilePicture.transferTo(dest); // 프론트엔드에서 업로드한 파일을 백엔드에서 실제로 저장

        return filePath;
    }

    public String setBackgroundPath(int userCd, MultipartFile backgroundImage) throws IOException {
        String uploadDir = System.getProperty("user.dir") + "\\src\\main\\resources\\static\\backgroundImage\\";
        String fileName = UUID.randomUUID() + "_" + userCd + "_" + backgroundImage.getOriginalFilename();
        String filePath = uploadDir + fileName;

        File dest = new File(filePath); // 업로드된 파일을 저장할 파일 경로를 나타내는 File 객체 생성
        backgroundImage.transferTo(dest); // 프론트엔드에서 업로드한 파일을 백엔드에서 실제로 저장

        return filePath;
    }

    public String getProfilePictureByUserCd(int userCd) {
        UserEntity userEntity = userService.getUserByUserCd(userCd);
        if (userEntity == null) { return "defaultPfImage"; }
        ProfileDTO profileDTO = profileRepository.findByUserCd(userEntity);
        if(profileDTO != null) {
            return profileDTO.getPfImage();
        } else {
            return "defaultPfImage";
        }
    }

    public String getBackgroundImageByUserCd(int userCd) {
        UserEntity userEntity = userService.getUserByUserCd(userCd);
        if (userEntity == null) { return "defaultBgImage"; }
        //userEntity를 통해 profileDTO 조회
        ProfileDTO profileDTO = profileRepository.findByUserCd(userEntity);
        if(profileDTO != null) {
            return profileDTO.getBgImage();
        } else {
            return "defaultBgImage";
        }
    }

    public ResponseEntity<Resource> getImageResourceResponse(String filePath) {
        if (filePath == null) {
            return ResponseEntity.notFound().build();
        }

        // 파일의 확장자 추출 ... 이미지 타입 설정
        String fileExtension = getFileExtension(filePath);
        MediaType mediaType;
        if("jpg".equalsIgnoreCase(fileExtension) || "jpeg".equalsIgnoreCase(fileExtension)) {
            mediaType = MediaType.IMAGE_JPEG;
        } else if ("png".equalsIgnoreCase(fileExtension)) {
            mediaType = MediaType.IMAGE_PNG;
        } else {
            mediaType = MediaType.IMAGE_JPEG;
        }

        // 이미지 파일을 Resource로 변환하여 ResponseEntity로 반환 ... 파일 리소스를 표현하기 위해 사용되는 Spring Framework 클래스
        Resource resource = new FileSystemResource(filePath);
        return ResponseEntity.ok().contentType(mediaType).body(resource);
    }

    private String getFileExtension(String filePath) { // 이미지 확장자 추출
        int dotIndex = filePath.lastIndexOf(".");
        if (dotIndex > 0 && dotIndex < filePath.length() - 1) {
            return filePath.substring(dotIndex + 1).toLowerCase();
        }
        return "";
    }

    public ResponseEntity<String> updateUserImageToDefault (Map<String, String> requestData) {
        int userCd = Integer.parseInt(requestData.get("userCd"));
        String imageType = requestData.get("imageType");
        String imageValue = requestData.get("imageValue");

        UserEntity userEntity = userService.getUserByUserCd(userCd);
        if (userEntity == null) {
            return ResponseEntity.notFound().build();
        }
        ProfileDTO profileDTO = getProfileByUserCd(userEntity);

        if ("pfImage".equals(imageType)) {
            profileDTO.setPfImage(imageValue);
            saveProfile(profileDTO);
            return ResponseEntity.ok("Profile picture updated to default");
        } else if ("bgImage".equals(imageType)) {
            profileDTO.setBgImage(imageValue);
            saveProfile(profileDTO);
            return ResponseEntity.ok("Background image updated to default");
        } else {
            return ResponseEntity.badRequest().body("Invalid image type provided");
        }
    }
    }