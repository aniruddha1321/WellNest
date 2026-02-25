package com.wellnest.model;

public class HealthTip {
    private String text;
    private String imageUrl;
    private String category;
    private long timestamp;

    public HealthTip() {
    }

    public HealthTip(String text, String imageUrl, String category) {
        this.text = text;
        this.imageUrl = imageUrl;
        this.category = category;
        this.timestamp = System.currentTimeMillis();
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }
}
