
export interface casing_interface {
    /**
     * propertyCasing
     */
    property_casing: string;
    /**
     * methodCasing
     */
    method_casing(): void;
    /**
     * parameterCasing
     */
    parameter_casing(parameter_casing: string): void;
    /**
     * typeCasing
     */
    type_casing: string;
    /**
     * interfaceCasing
     */
    interface_casing: string;
    /**
     * enumCasing
     */
    enum_casing: string;
}