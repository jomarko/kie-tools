package org.drools.workbench.screens.drltext.model;

import org.drools.workbench.models.datamodel.oracle.PackageDataModelOracle;
import org.jboss.errai.common.client.api.annotations.Portable;
import org.uberfire.commons.validation.PortablePreconditions;

@Portable
public class DrlModelContent {

    private String drl;
    private PackageDataModelOracle oracle;

    public DrlModelContent() {
    }

    public DrlModelContent( final String drl,
                            final PackageDataModelOracle oracle ) {
        this.drl = PortablePreconditions.checkNotNull( "drl",
                                                       drl );
        this.oracle = PortablePreconditions.checkNotNull( "oracle",
                                                          oracle );
    }

    public String getDrl() {
        return this.drl;
    }

    public PackageDataModelOracle getDataModel() {
        return this.oracle;
    }

}
