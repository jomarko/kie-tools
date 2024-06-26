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

package org.jboss.errai.common.server;

import java.io.CharArrayWriter;
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletOutputStream;
import javax.servlet.WriteListener;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;

/**
 * Shared utilities for servlet filters in Errai.
 *  
 * @author Christian Sadilek <csadilek@redhat.com>
 */
public class FilterCacheUtil {
  private static final String EXPIRES_HEADER = "Expires";
  private static final String CACHE_CONTROL_HEADER = "Cache-Control";
  private static final String PRAGMA_HEADER = "Pragma";

  private FilterCacheUtil() {}
  
  public static HttpServletResponse noCache(final HttpServletResponse response) {
    response.setHeader( CACHE_CONTROL_HEADER, "no-cache, no-store, must-revalidate" );
    response.setHeader( PRAGMA_HEADER, "no-cache" );
    response.setDateHeader( EXPIRES_HEADER, 0 );
    return response;
  }
  
  public static CharResponseWrapper getCharResponseWrapper(final HttpServletResponse response) {
    return new CharResponseWrapper(response);
  }
  
  public static class CharResponseWrapper extends HttpServletResponseWrapper {

    protected CharArrayWriter charWriter = new CharArrayWriter();

    protected ServletOutputStream outputStream = new ServletOutputStream() {

      @Override
      public boolean isReady() {
        return true;
      }

      @Override
      public void setWriteListener(WriteListener writeListener) {
        // no-op
      }

      @Override
      public void write(int b) throws IOException {
        charWriter.write(b);
      }
    };

    protected PrintWriter writer = new PrintWriter(charWriter);

    public CharResponseWrapper(final HttpServletResponse response) {
      super(response);
    }

    @Override
    public ServletOutputStream getOutputStream() throws IOException {
      return outputStream;
    }

    @Override
    public PrintWriter getWriter() throws IOException {
      return writer;
    }

    @Override
    public void flushBuffer() throws IOException {
      // Don't remove this override!
      // When intercepting static content, WAS 8.5.5.5 prematurely calls this
      // method to flush the output stream before we can calculate the content
      // length (see above).
    }

    @Override
    public String toString() {
      return charWriter.toString();
    }
  }
}
