package com.campusdual.bfp.Enumerados;

import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;

public enum EnumModalidadTrabajo {
    PRESENCIAL("PRESENCIAL"),
    HIBRIDO("HIBRIDO"),
    REMOTO("REMOTO");

    private static final Map<String, EnumModalidadTrabajo> lookup = new HashMap<>();
    
    static {
        for (EnumModalidadTrabajo e : EnumSet.allOf(EnumModalidadTrabajo.class)) {
            lookup.put(e.getValue().toUpperCase(), e);
        }
    }

    public static EnumModalidadTrabajo fromValue(String value) {
        return lookup.get(value.toUpperCase());
    }

    private final String value;

    EnumModalidadTrabajo(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
