package com.reelreview.config.oauth.provider;

import java.util.Map;

public interface OAuth2UserInfo {
    Map<String, Object> getAttributes();
    String getProviderCd();
    String getProvider();
    String getUserEmail();
    String getUserName();
}
