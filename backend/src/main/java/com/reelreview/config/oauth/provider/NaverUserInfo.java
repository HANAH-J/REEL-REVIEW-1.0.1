package com.reelreview.config.oauth.provider;

import java.util.Map;

public class NaverUserInfo implements OAuth2UserInfo {

    private Map<String, Object> attributes; // oauth2User.getAttributes()
    private Map<String, Object> attributesResponse;

    public NaverUserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
        this.attributesResponse = (Map<String, Object>) attributes.get("response");
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public String getProviderCd() {
        return attributesResponse.get("id").toString();
    }

    @Override
    public String getProvider() {
        return "naver";
    }

    @Override
    public String getUserEmail() {
        return attributesResponse.get("email").toString();
    }

    @Override
    public String getUserName() {
        return attributesResponse.get("name").toString();
    }
}
