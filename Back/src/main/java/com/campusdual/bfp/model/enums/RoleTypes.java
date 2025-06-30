package com.campusdual.bfp.model.enums;

public enum RoleTypes {
    ADMIN(1),
    COMPANY(2),
    CANDIDATE(3);

    private final long id;

    RoleTypes(long id) {
        this.id = id;
    }

    public long getId() {
        return id;
    }
}
