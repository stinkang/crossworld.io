// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
#nullable disable

using System;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace  CrossWorldApp.Views.ManageAccount
{
    /// <summary>
    ///     This API supports the ASP.NET Core Identity default UI infrastructure and is not intended to be used
    ///     directly from your code. This API may change or be removed in future releases.
    /// </summary>
    public static class ManageNavPages
    {
        public static string ActivePageClass(ViewContext viewContext, string controller, string action)
        {
            var isActive = viewContext.RouteData.Values["Controller"].ToString().Equals(controller, StringComparison.OrdinalIgnoreCase)
                && viewContext.RouteData.Values["Action"].ToString().Equals(action, StringComparison.OrdinalIgnoreCase);

            return isActive ? "active" : "";
        }
    }
}
