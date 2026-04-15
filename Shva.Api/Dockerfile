# build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

COPY *.sln .
COPY Shva.Api/*.csproj ./Shva.Api/
RUN dotnet restore

COPY . .
WORKDIR /app/Shva.Api
RUN dotnet publish -c Release -o out

# runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

COPY --from=build /app/Shva.Api/out .

EXPOSE 8080

ENTRYPOINT ["dotnet", "Shva.Api.dll"]