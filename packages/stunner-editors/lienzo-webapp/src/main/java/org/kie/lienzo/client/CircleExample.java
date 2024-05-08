/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 * 
 *  http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License. 
 */

package org.kie.lienzo.client;

import com.ait.lienzo.client.core.shape.Circle;
import com.ait.lienzo.shared.core.types.Color;
import org.kie.lienzo.client.util.Util;

public class CircleExample extends BaseShapesExample<Circle> implements Example {

    public CircleExample(String title) {
        super(title);
        this.setPaddings(20, 20, 30, 100);
        numberOfShapes = 40;
        shapes = new Circle[numberOfShapes];
    }

    @Override
    public void run() {
        for (int i = 0; i < numberOfShapes; i++) {
            shapes[i] = new Circle(Util.randomNumber(8, 10));
            shapes[i].setStrokeColor(Color.getRandomHexColor()).setStrokeWidth(2).setFillColor(Color.getRandomHexColor()).setDraggable(true);
            layer.add(shapes[i]);
        }
        setLocation();
        layer.draw();
    }
}
